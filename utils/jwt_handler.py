from jose import JWTError, jwt

SECRET_KEY = "change_this_to_a_long_random_secret"

ALGORITHM = "HS256"


def verify_token(token):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:

        return None