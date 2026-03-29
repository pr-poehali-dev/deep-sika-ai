import os
import json
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """
    Обработчик сообщений для ИИ-ассистента Elf.
    Принимает историю сообщений и настройки, возвращает ответ от OpenAI.
    """
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный формат запроса'})
        }

    messages = body.get('messages', [])
    style = body.get('style', 'friendly')
    temperature = float(body.get('temperature', 0.7))

    style_prompts = {
        'friendly': 'Ты — Elf, дружелюбный и тёплый ИИ-ассистент. Общайся неформально, с заботой и искренностью. Ты помогаешь пользователям решать задачи.',
        'formal': 'Ты — Elf, профессиональный ИИ-ассистент. Общайся чётко, структурированно и деловито. Избегай лишних слов.',
        'concise': 'Ты — Elf, лаконичный ИИ-ассистент. Отвечай коротко и по существу. Только суть, без воды.',
    }

    system_prompt = style_prompts.get(style, style_prompts['friendly'])

    openai_messages = [{'role': 'system', 'content': system_prompt}]
    for msg in messages:
        role = msg.get('role')
        content = msg.get('content', '')
        if role in ('user', 'assistant') and content:
            openai_messages.append({'role': role, 'content': content})

    api_key = os.environ.get('OPENAI_API_KEY', '')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'API ключ не настроен'})
        }

    payload = json.dumps({
        'model': 'gpt-4o-mini',
        'messages': openai_messages,
        'temperature': min(max(temperature, 0.0), 1.0),
        'max_tokens': 1024,
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://api.openai.com/v1/chat/completions',
        data=payload,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        method='POST'
    )

    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            result = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        try:
            error_data = json.loads(error_body)
            error_msg = error_data.get('error', {}).get('message', 'Ошибка OpenAI')
        except Exception:
            error_msg = 'Ошибка при обращении к OpenAI'
        return {
            'statusCode': 502,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': error_msg})
        }

    reply = result['choices'][0]['message']['content']

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'reply': reply})
    }
