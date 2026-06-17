import {
    Column,
    Table,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    Unique,
    DataType,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
    BelongsToMany
} from"sequelize-typescript"
import { CompanyPg } from "./CompanyPg.js"


//Modelo tabla users
@Table({ tableName: "users", timestamps:true})
export class UserPg extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare firstName: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    declare secondName?: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare firstLastName: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    declare secondLastName?: string;

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING)
    declare email: string;

    // Contraseña hasheada (nunca se guarda en texto plano)
    @AllowNull(false)
    @Column(DataType.STRING)
    declare passwordHash: string;

    @AllowNull(false)
    @Column(DataType.ENUM('owner', 'tecnico', 'supervisor', 'admin'))
    declare role: 'owner' | 'tecnico' | 'supervisor' | 'admin';
    
    @AllowNull(false)
    @Column({type:DataType.BOOLEAN, defaultValue:true})
    declare isActive: boolean;

    //Relacion con company
    @ForeignKey(() => CompanyPg)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare companyId: number;

    @BelongsTo(() => CompanyPg)
    company!:CompanyPg;

    //Timestap automiticos
    @CreatedAt
    declare createdAt:Date;

    @UpdatedAt
    declare updatedAt:Date;
}