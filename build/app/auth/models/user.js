var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import hash from '@adonisjs/core/services/hash';
import { BaseModel, beforeCreate, column, hasOne } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import Profile from '#profile/models/profile';
import { withAuthFinder } from '@adonisjs/auth';
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens';
import { Secret, compose } from '@adonisjs/core/helpers';
import { v4 as uuid } from 'uuid';
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
    uids: ['email'],
    passwordColumnName: 'password',
});
export default class User extends compose(BaseModel, AuthFinder) {
    static accessTokens = DbAccessTokensProvider.forModel(User, {
        expiresIn: '30 days',
        prefix: 'oat_',
        table: 'auth_access_tokens',
        type: 'auth_token',
        tokenSecretLength: 40,
    });
    currentAccessToken;
    static async createUUID(user) {
        user.id = uuid();
    }
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    column({ serializeAs: null }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    column({
        prepare: (accessToken) => accessToken.release(),
        consume: (accessToken) => new Secret(accessToken),
    }),
    __metadata("design:type", Secret)
], User.prototype, "accessToken", void 0);
__decorate([
    column({
        prepare: (accessToken) => accessToken.release(),
        consume: (accessToken) => new Secret(accessToken),
    }),
    __metadata("design:type", Secret)
], User.prototype, "refreshToken", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "spotifyId", void 0);
__decorate([
    column.dateTime({ autoCreate: true, serializeAs: 'createdAt' }),
    __metadata("design:type", DateTime)
], User.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' }),
    __metadata("design:type", Object)
], User.prototype, "updatedAt", void 0);
__decorate([
    hasOne(() => Profile),
    __metadata("design:type", Object)
], User.prototype, "profile", void 0);
__decorate([
    beforeCreate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "createUUID", null);
//# sourceMappingURL=user.js.map