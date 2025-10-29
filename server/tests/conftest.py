import pytest
from app import create_app, db

@pytest.fixture(scope='module')
def test_client():
    """Create a Flask test client with an in-memory database."""
    flask_app = create_app()
    flask_app.config['TESTING'] = True
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    flask_app.config['WTF_CSRF_ENABLED'] = False

    with flask_app.app_context():
        db.create_all()
        yield flask_app.test_client()
        db.drop_all()

