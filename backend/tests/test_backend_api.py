import os
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://mom-wishes-1.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def test_root(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200
    assert "message" in r.json()


def test_cloudinary_signature(session):
    r = session.get(f"{API}/cloudinary/signature")
    assert r.status_code == 200
    data = r.json()
    for k in ["signature", "timestamp", "cloud_name", "api_key", "folder"]:
        assert k in data and data[k]
    assert data["folder"].startswith("uploads/")


def test_cloudinary_signature_invalid_folder(session):
    r = session.get(f"{API}/cloudinary/signature", params={"folder": "evil/path"})
    assert r.status_code == 400


@pytest.fixture(scope="module")
def created_card(session):
    payload = {
        "sender_name": "TEST_Maya",
        "recipient_name": "TEST_Mom",
        "message": "Thank you for everything.",
        "bg_color": "#FDFBF7",
        "font_family": "Elegant Serif",
        "frame": "soft",
        "stickers": [{"id": "h1", "type": "Heart", "x": 50, "y": 50, "size": 32, "color": "#E07A5F", "rotation": 0}],
        "music_track": "piano",
    }
    r = session.post(f"{API}/cards", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "_id" not in data
    assert data["slug"] and data["id"]
    assert data["sender_name"] == "TEST_Maya"
    return data


def test_get_card(session, created_card):
    r = session.get(f"{API}/cards/{created_card['slug']}")
    assert r.status_code == 200
    data = r.json()
    assert "_id" not in data
    assert data["slug"] == created_card["slug"]
    assert data["recipient_name"] == "TEST_Mom"
    assert len(data["stickers"]) == 1


def test_get_card_404(session):
    r = session.get(f"{API}/cards/doesnotexist123")
    assert r.status_code == 404


def test_ai_suggest_message(session):
    r = session.post(f"{API}/ai/suggest-message", json={
        "recipient_name": "Anjali",
        "tone": "heartfelt",
        "relationship": "mother",
    }, timeout=120)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "suggestions" in data
    assert isinstance(data["suggestions"], list)
    assert len(data["suggestions"]) >= 2
    for s in data["suggestions"]:
        assert isinstance(s, str) and len(s) > 10
