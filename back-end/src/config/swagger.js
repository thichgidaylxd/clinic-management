const swaggerJsdoc = require('swagger-jsdoc');
const { ENV } = require('./env');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Clinic Management API',
            version: '1.0.0',
            description: 'API Documentation cho Hệ thống Quản lý Phòng khám',
            contact: {
                name: 'API Support',
                email: 'support@clinic.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: `http://localhost:${ENV.PORT}/api/v1`,
                description: 'Development server'
            },
            {
                url: 'https://api.clinic.com/api/v1',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Nhập JWT token (không cần thêm "Bearer" ở đầu)'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'Có lỗi xảy ra'
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: {
                                        type: 'string'
                                    },
                                    message: {
                                        type: 'string'
                                    }
                                }
                            }
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        ma_nguoi_dung: {
                            type: 'string',
                            format: 'uuid',
                            example: '550e8400-e29b-41d4-a716-446655440000'
                        },
                        ma_vai_tro: {
                            type: 'string',
                            format: 'uuid'
                        },
                        ten_nguoi_dung: {
                            type: 'string',
                            example: 'Nguyễn Văn A'
                        },
                        ho_nguoi_dung: {
                            type: 'string',
                            example: 'Nguyễn'
                        },
                        ten_dang_nhap_nguoi_dung: {
                            type: 'string',
                            example: 'nguyenvana'
                        },
                        email_nguoi_dung: {
                            type: 'string',
                            format: 'email',
                            example: 'nguyenvana@email.com'
                        },
                        so_dien_thoai_nguoi_dung: {
                            type: 'string',
                            example: '0123456789'
                        },
                        gioi_tinh_nguoi_dung: {
                            type: 'integer',
                            enum: [0, 1, 2],
                            description: '0: Nữ, 1: Nam, 2: Khác'
                        },
                        trang_thai_nguoi_dung: {
                            type: 'integer',
                            enum: [0, 1],
                            description: '0: Không hoạt động, 1: Hoạt động'
                        },
                        ten_vai_tro: {
                            type: 'string',
                            example: 'Bệnh nhân'
                        },
                        ngay_tao_nguoi_dung: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Role: {
                    type: 'object',
                    properties: {
                        ma_vai_tro: {
                            type: 'string',
                            format: 'uuid'
                        },
                        ten_vai_tro: {
                            type: 'string',
                            enum: ['Admin', 'Bác sĩ', 'Lễ tân', 'Bệnh nhân']
                        },
                        trang_thai_vai_tro: {
                            type: 'integer',
                            enum: [0, 1]
                        }
                    }
                }
            },
            responses: {
                UnauthorizedError: {
                    description: 'Không có quyền truy cập - Token không hợp lệ hoặc đã hết hạn',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                success: false,
                                message: 'Vui lòng đăng nhập để tiếp tục',
                                timestamp: '2024-01-01T00:00:00.000Z'
                            }
                        }
                    }
                },
                ForbiddenError: {
                    description: 'Không có quyền thực hiện hành động này',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                NotFoundError: {
                    description: 'Không tìm thấy dữ liệu',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                ValidationError: {
                    description: 'Dữ liệu không hợp lệ',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                success: false,
                                message: 'Dữ liệu không hợp lệ',
                                errors: [
                                    {
                                        field: 'email_nguoi_dung',
                                        message: 'Email không hợp lệ'
                                    }
                                ],
                                timestamp: '2024-01-01T00:00:00.000Z'
                            }
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Authentication',
                description: 'API xác thực và quản lý phiên đăng nhập'
            },
            {
                name: 'Users',
                description: 'API quản lý người dùng'
            },
            {
                name: 'Roles',
                description: 'API quản lý vai trò'
            },
            {
                name: 'Doctors',
                description: 'API quản lý bác sĩ'
            },
            {
                name: 'Patients',
                description: 'API quản lý bệnh nhân'
            },
            {
                name: 'Appointments',
                description: 'API quản lý lịch hẹn'
            },
            {
                name: 'Medicines',
                description: 'API quản lý thuốc'
            },
            {
                name: 'Invoices',
                description: 'API quản lý hóa đơn'
            },
            {
                name: 'Rooms',
                description: 'API quản lý phòng khám và loại phòng khám'
            },
            {
                name: 'Work Schedules',
                description: 'API quản lý lịch làm việc bác sĩ'
            },
            {
                name: 'Patients',
                description: 'API quản lý bệnh nhân'
            },
            {
                name: 'Appointments',
                description: 'API quản lý đặt lịch khám bệnh'
            },

        ]
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'] // Đường dẫn tới các file chứa JSDoc
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;