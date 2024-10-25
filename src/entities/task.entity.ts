import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: string;

    @ManyToOne(type => User, user => user.tasks, { eager: true } )
    //Este decorador para excluir el retorno de esta data se tiene que usar con un interceptor
    @Exclude({ toPlainOnly: true })
    user: User;
};