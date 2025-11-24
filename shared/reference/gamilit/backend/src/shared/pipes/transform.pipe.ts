/**
 * Transform Pipes
 *
 * Common transformation pipes for route parameters and query strings.
 */

import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

/**
 * Parse integer pipe
 */
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(`${value} is not a valid integer`);
    }
    return val;
  }
}

/**
 * Parse boolean pipe
 */
@Injectable()
export class ParseBoolPipe implements PipeTransform<string, boolean> {
  transform(value: string): boolean {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
    throw new BadRequestException(`${value} is not a valid boolean`);
  }
}

/**
 * Trim string pipe
 */
@Injectable()
export class TrimPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    return value?.trim() ?? value;
  }
}

/**
 * Lowercase pipe
 */
@Injectable()
export class LowercasePipe implements PipeTransform<string, string> {
  transform(value: string): string {
    return value?.toLowerCase() ?? value;
  }
}

/**
 * Uppercase pipe
 */
@Injectable()
export class UppercasePipe implements PipeTransform<string, string> {
  transform(value: string): string {
    return value?.toUpperCase() ?? value;
  }
}
