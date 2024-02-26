var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import NotFountException from '#exceptions/not_fount.exception';
import Profile from '#profile/models/profile';
import { createProfileValidator } from '#profile/validators/create_profile_validator';
import { uploadProfileAvatarValidator } from '#profile/validators/upload_profile_avatar_validator';
import { inject } from '@adonisjs/core';
import app from '@adonisjs/core/services/app';
import { DateTime } from 'luxon';
let ProfileController = class ProfileController {
    constructor() { }
    serializeUserInfo(user, profile) {
        return {
            id: profile.id,
            userId: user.id,
            username: user.username,
            avatar: profile.avatar,
            dateOfBirth: profile.dateOfBirth,
            description: profile.description,
            genderId: profile.genderId,
            trackIds: profile.tracks,
            albumIds: profile.albums,
            artistIds: profile.artists,
        };
    }
    async getUserInfo({ auth, response }) {
        const user = auth.getUserOrFail();
        const profile = await Profile.query().where('user_id', user.id).first();
        if (!profile) {
            throw new NotFountException();
        }
        const profileData = this.serializeUserInfo(user, profile);
        return response.status(200).send({
            status: true,
            data: {
                ...profileData,
            },
        });
    }
    async updateUser(user, data) {
        user.username = data.username;
        return user.save();
    }
    async updateUserProfile(user, dateOfBirth, data) {
        const profile = (await Profile.query().where('user_id', user.id).first()) ?? new Profile();
        profile.dateOfBirth = DateTime.fromJSDate(dateOfBirth);
        profile.description = data.description;
        profile.genderId = data.genderId;
        profile.userId = user.id;
        return profile.save();
    }
    async createUserProfile({ auth, request, response }) {
        const user = auth.getUserOrFail();
        const { username, dateOfBirth, ...validatedBody } = await request.validateUsing(createProfileValidator);
        const profile = await this.updateUserProfile(user, dateOfBirth, validatedBody);
        const newUserData = await this.updateUser(user, { username });
        return response.created(this.serializeUserInfo(newUserData, profile));
    }
    async uploadUserAvatar({ auth, request }) {
        const user = auth.getUserOrFail();
        const { avatar } = await request.validateUsing(uploadProfileAvatarValidator);
        await this.saveUserAvatarImage(user, avatar);
        const profile = await Profile.query().where('user_id', user.id).first();
        if (!profile) {
            throw new NotFountException();
        }
        return this.serializeUserInfo(user, profile);
    }
    buildAvatarFileName(user, file) {
        return `${user.id}.avatar.${file.extname}`;
    }
    async saveUserAvatarImage(user, file) {
        const fileName = this.buildAvatarFileName(user, file);
        await file.move(app.makePath('uploads'), {
            name: fileName,
            overwrite: true,
        });
        const profile = await Profile.updateOrCreate({
            userId: user.id,
        }, {
            avatar: fileName,
        });
        profile.save();
    }
    async getUserAvatar({ auth, response }) {
        const user = auth.getUserOrFail();
        const avatar = user.profile.avatar;
        if (!avatar) {
            throw new NotFountException();
        }
        const absolutePath = app.makePath('uploads', avatar);
        return response.download(absolutePath);
    }
};
ProfileController = __decorate([
    inject(),
    __metadata("design:paramtypes", [])
], ProfileController);
export default ProfileController;
//# sourceMappingURL=profile_controller.js.map