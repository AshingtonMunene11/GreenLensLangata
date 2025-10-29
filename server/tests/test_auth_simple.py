import pytest
from app import create_app, db

@pytest.fixture
def client():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
    })

    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()


def test_register_endpoint_exists(client):
    """Check that /api/auth/register is reachable."""
    response = client.post("/api/auth/register", json={
        "username": "tester",
        "email": "test@example.com",
        "password": "password123"
    })
    # We expect either 201 (success) or 400 (bad request)
    assert response.status_code in [200, 201, 400]
    print("Register response:", response.json)


def test_login_endpoint_exists(client):
    """Check that /api/auth/login is reachable."""
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    # We expect either 200 (success) or 401 (unauthorized)
    assert response.status_code in [200, 401]
    print("Login response:", response.json)
