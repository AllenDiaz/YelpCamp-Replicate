const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'YelpCamp API',
      version: '1.0.0',
      description: 'A comprehensive API for managing campgrounds, reviews, and user authentication in YelpCamp application',
      contact: {
        name: 'YelpCamp Team',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server',
      },
      {
        url: 'http://localhost:5001',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT authorization token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
              example: '507f1f77bcf86cd799439011',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com',
            },
            username: {
              type: 'string',
              description: 'Username',
              example: 'johndoe',
            },
          },
        },
        Campground: {
          type: 'object',
          required: ['title', 'location', 'price'],
          properties: {
            _id: {
              type: 'string',
              description: 'Campground ID',
              example: '507f1f77bcf86cd799439011',
            },
            title: {
              type: 'string',
              description: 'Campground title',
              example: 'Mountain View Campground',
            },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                    description: 'Image URL',
                  },
                  filename: {
                    type: 'string',
                    description: 'Image filename',
                  },
                },
              },
              description: 'Campground images',
            },
            geometry: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['Point'],
                  example: 'Point',
                },
                coordinates: {
                  type: 'array',
                  items: {
                    type: 'number',
                  },
                  minItems: 2,
                  maxItems: 2,
                  example: [-122.4194, 37.7749],
                  description: '[longitude, latitude]',
                },
              },
            },
            price: {
              type: 'number',
              description: 'Price per night',
              example: 25.99,
            },
            description: {
              type: 'string',
              description: 'Campground description',
              example: 'A beautiful campground with stunning mountain views',
            },
            location: {
              type: 'string',
              description: 'Campground location',
              example: 'Yosemite National Park, CA',
            },
            author: {
              $ref: '#/components/schemas/User',
            },
            reviews: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Review',
              },
            },
          },
        },
        Review: {
          type: 'object',
          required: ['body', 'rating'],
          properties: {
            _id: {
              type: 'string',
              description: 'Review ID',
              example: '507f1f77bcf86cd799439011',
            },
            body: {
              type: 'string',
              description: 'Review text',
              example: 'Great campground! Had an amazing time.',
            },
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              description: 'Rating from 1 to 5',
              example: 5,
            },
            author: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
            error: {
              type: 'string',
              description: 'Error details',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT token',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

module.exports = swaggerJsdoc(options);
