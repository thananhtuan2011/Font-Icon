import { AuthenticationService } from '@app/_core/services/authentication.service';

export function appInitializer(authenticationService: AuthenticationService) {
  return () => {
    return authenticationService.refreshToken('appInitializer').pipe();
  };
}
