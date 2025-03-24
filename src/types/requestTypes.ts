import { Request } from 'express';
import { Types } from 'mongoose';
import { IUser } from '../Model/UserModel'; 


type RequestUser = Omit<IUser, 'password'> & { _id: Types.ObjectId };


type RequestWithUser = Request & {
    user?: RequestUser;
};

export { RequestUser, RequestWithUser };
