import pytest
from app.services.plaid_client import create_link_token
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser

@pytest.mark.asyncio
async def test_create_link_token_success(mocker):
    # Mock the client returned by get_plaid_client
    mock_client = mocker.MagicMock()
    # Ensure link_token_create returns a dictionary with the expected link_token
    mock_client.link_token_create.return_value = {"link_token": "fake_link_token_123"}

    # Mock get_plaid_client to return our mock_client
    mock_get_client = mocker.patch("app.services.plaid_client.get_plaid_client", return_value=mock_client)

    user_id = "test_user_id_456"
    result = await create_link_token(user_id)

    assert result == "fake_link_token_123"

    # Verify get_plaid_client was called once
    mock_get_client.assert_called_once()

    # Verify link_token_create was called once
    mock_client.link_token_create.assert_called_once()

    # Check the argument passed to link_token_create
    args, kwargs = mock_client.link_token_create.call_args
    request_arg = args[0]

    assert isinstance(request_arg, LinkTokenCreateRequest)
    # the properties are likely accessible as dictionary items or attributes.
    # Plaid model objects can be a bit tricky, but checking the type is a good start.
    assert request_arg["client_name"] == "Finance Tracker"
    assert request_arg["language"] == "en"
    assert request_arg["user"]["client_user_id"] == user_id

@pytest.mark.asyncio
async def test_create_link_token_failure(mocker):
    # Mock the client returned by get_plaid_client
    mock_client = mocker.MagicMock()
    # Ensure link_token_create raises an exception
    mock_client.link_token_create.side_effect = Exception("API Error")

    # Mock get_plaid_client to return our mock_client
    mock_get_client = mocker.patch("app.services.plaid_client.get_plaid_client", return_value=mock_client)

    user_id = "test_user_id_456"

    with pytest.raises(Exception) as exc_info:
        await create_link_token(user_id)

    assert str(exc_info.value) == "API Error"

    mock_get_client.assert_called_once()
    mock_client.link_token_create.assert_called_once()
