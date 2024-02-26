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
import Gender from '#profile/models/gender';
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import Album from './album.js';
import Artist from './artist.js';
import Track from './track.js';
export default class Profile extends BaseModel {
    static async createUUID(profile) {
        profile.id = uuid();
    }
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", String)
], Profile.prototype, "id", void 0);
__decorate([
    column.dateTime({ autoCreate: false, autoUpdate: false, serializeAs: 'dateOfBirth' }),
    __metadata("design:type", DateTime)
], Profile.prototype, "dateOfBirth", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Profile.prototype, "description", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Profile.prototype, "avatar", void 0);
__decorate([
    column.dateTime({ autoCreate: true, serializeAs: 'createdAt' }),
    __metadata("design:type", DateTime)
], Profile.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' }),
    __metadata("design:type", Object)
], Profile.prototype, "updatedAt", void 0);
__decorate([
    column({ serializeAs: 'genderId' }),
    __metadata("design:type", Object)
], Profile.prototype, "genderId", void 0);
__decorate([
    belongsTo(() => Gender, { foreignKey: 'genderId' }),
    __metadata("design:type", Object)
], Profile.prototype, "gender", void 0);
__decorate([
    column({ serializeAs: 'userId' }),
    __metadata("design:type", Object)
], Profile.prototype, "userId", void 0);
__decorate([
    belongsTo(() => User),
    __metadata("design:type", Object)
], Profile.prototype, "user", void 0);
__decorate([
    hasMany(() => Track),
    __metadata("design:type", Object)
], Profile.prototype, "tracks", void 0);
__decorate([
    hasMany(() => Artist),
    __metadata("design:type", Object)
], Profile.prototype, "artists", void 0);
__decorate([
    hasMany(() => Album),
    __metadata("design:type", Object)
], Profile.prototype, "albums", void 0);
__decorate([
    beforeCreate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Profile]),
    __metadata("design:returntype", Promise)
], Profile, "createUUID", null);
//# sourceMappingURL=profile.js.map