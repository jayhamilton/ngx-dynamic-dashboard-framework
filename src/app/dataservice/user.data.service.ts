import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../configuration/tab-rbac/rbac.service';
import { EventService } from '../eventservice/event.service';


@Injectable()
export class UserDataService {
    users: Array<IUser> = [];
   
    constructor(private httpClient: HttpClient, private eventService: EventService) { }

    getUsers() {
        return this.users;
    }

    getUsersByRole(role: string){
        return this.users.filter((user)=>{
            return user.roles.toLowerCase() === (role.toLowerCase());
        })
    }

    setUsers(userList: Array<IUser>){
        this.users.length = 0;
        this.users = userList;

        this.eventService.emitUserDataChanged();

    }

    loadUsers(){

        this.callUsersAPI().subscribe(_users=>{

            this.users.length = 0;
            _users.forEach(user=>{

                this.users.push(user);
            })

        })
    }

    callUsersAPI() {

        
            let apiEndPoint = environment.apihost + environment.userAPI;

            let sessionKey = sessionStorage.getItem(environment.sessionToken);

            let headers = new HttpHeaders({
                Authorization: '' + sessionKey,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            });

            const body = { title: 'Angular Get Request Example' };

            return this.httpClient.get<IUser[]>(apiEndPoint, {
                headers,
            })
    }


}
