var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import User from '#auth/models/user';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
export default class AuthProviders extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], AuthProviders.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AuthProviders.prototype, "accessToken", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AuthProviders.prototype, "refreshToken", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AuthProviders.prototype, "type", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], AuthProviders.prototype, "expiresIn", void 0);
__decorate([
    column.dateTime({
        autoCreate: false,
        autoUpdate: false,
    }),
    __metadata("design:type", DateTime)
], AuthProviders.prototype, "expiresAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AuthProviders.prototype, "providerUserId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AuthProviders.prototype, "userId", void 0);
__decorate([
    belongsTo(() => User),
    __metadata("design:type", Object)
], AuthProviders.prototype, "user", void 0);
//# sourceMappingURL=auth_providers.js.map