import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

/**
 * Modelo de respuesta paginada
 */
export class PaginatedResponse<T> {
  data!: T[];
  meta!: {
    total: number;
    page: number;
    lastPage: number;
    perPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * @ApiPaginatedResponse Decorator
 *
 * Documenta una respuesta paginada en Swagger
 * Usa: @ApiPaginatedResponse(UserDto)
 */
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description: 'Successfully retrieved paginated data',
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              meta: {
                type: 'object',
                properties: {
                  total: { type: 'number', example: 100 },
                  page: { type: 'number', example: 1 },
                  lastPage: { type: 'number', example: 10 },
                  perPage: { type: 'number', example: 10 },
                  hasNextPage: { type: 'boolean', example: true },
                  hasPreviousPage: { type: 'boolean', example: false },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
