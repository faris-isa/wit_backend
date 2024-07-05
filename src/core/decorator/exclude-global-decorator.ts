import { SetMetadata } from '@nestjs/common';

export const ExcludeGlobalGuard = () => SetMetadata('excludeGlobalGuard', true);
