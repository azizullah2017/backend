from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import ExpiringToken

class ExpiringTokenAuthentication(TokenAuthentication):
    model = ExpiringToken

    def authenticate_credentials(self, key):
        try:
            token = self.model.objects.get(key=key)
        except self.model.DoesNotExist:
            raise AuthenticationFailed('Invalid token.')

        if token.is_expired:
            token.delete()
            raise AuthenticationFailed('Token has expired.')

        if not token.user.is_active:
            token.delete()
            raise AuthenticationFailed('User is inactive or deleted.')

        return (token.user, token)
