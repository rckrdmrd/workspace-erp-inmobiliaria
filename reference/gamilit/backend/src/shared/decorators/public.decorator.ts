/**
 * Public Decorator
 *
 * Marks a route as public (bypasses authentication).
 * Usage: @Public() above controller method or class.
 */

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Public route decorator
 *
 * Use this decorator to mark routes that should be accessible without authentication.
 *
 * @example
 * @Public()
 * @Get('health')
 * healthCheck() { return 'OK'; }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
