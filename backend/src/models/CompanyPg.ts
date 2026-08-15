import { 
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    DataType,
    UpdatedAt,
    CreatedAt,
} from 'sequelize-typescript';

// Modelo para la tabla 'companies'
@Table({ tableName: 'companies', timestamps: true })
export class CompanyPg extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare name: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
    })
    declare isActive: boolean;

    @AllowNull(false)
    @Column({
        type: DataType.DATE,
        field: 'trial_expires_at'
    })
    declare trialExpiresAt: Date;

    @CreatedAt
    @Column({field: 'created_at', type: DataType.DATE})
    declare createdAt: Date;

    @UpdatedAt
    @Column({field: 'updated_at', type: DataType.DATE})
    declare updatedAt: Date;
}