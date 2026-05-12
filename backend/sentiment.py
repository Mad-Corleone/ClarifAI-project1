from transformers import pipeline

classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=None
)

def detect_sentiment(text):

    results = classifier(text)[0]

    scores = {}

    for item in results:
        scores[item['label']] = item['score']

    anger_score = scores.get("anger", 0)
    joy_score = scores.get("joy", 0)

    if anger_score > 0.50:
        return "angry"

    elif joy_score > 0.50:
        return "positive"

    else:
        return "neutral"