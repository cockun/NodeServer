import { Account } from '@entities/Account';
import { IUser } from '@entities/User';
import OracleDB from '../OracleDb/OracleDB';



export interface IUserDao {
    getOne: (email: string) => Promise<Account | undefined> ;
    getAll: () => Promise<IUser[]>;
    add: (user: IUser) => Promise<void>;
    update: (user: IUser) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

class UserDao extends OracleDB implements IUserDao {


    /**
     * @param email
     */
    public async getOne(email: string): Promise<Account | undefined> {
        const db = this.OpenDB();
        if(db){
            const coc =  await db<Account>("ACCOUNTS").select('ID').first();
            return coc;
        }
        return undefined;
    }


    /**
     *
     */
    public getAll(): Promise<IUser[]> {
         // TODO
        return Promise.resolve([]);
    }


    /**
     *
     * @param user
     */
    public async add(user: IUser): Promise<void> {
         // TODO
        return Promise.resolve(undefined);
    }


    /**
     *
     * @param user
     */
    public async update(user: IUser): Promise<void> {
         // TODO
        return Promise.resolve(undefined);
    }


    /**
     *
     * @param id
     */
    public async delete(id: number): Promise<void> {
         // TODO
        return Promise.resolve(undefined);
    }
}

export default UserDao;
