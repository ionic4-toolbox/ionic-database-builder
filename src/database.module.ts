import { DatabaseMigration } from "./providers/database-migration";
import { DATABASE_CREATOR, IS_AVAILABLE_DATABASE } from "./dependency-injection-definition";
import { Observable } from "rxjs";
import { ModuleWithProviders, NgModule, Provider, Type } from "@angular/core";
import { DatabaseHelperService } from "./providers/database-helper-service";
import { DatabaseMigrationContract } from "./providers/database-migration-contract";
import { ProviderTyped } from "./utils/provider-typed";
import { Database } from "./providers/database";
import { DatabaseSettingsFactoryContract } from "./utils/database-settings-factory-contract";
import { DatabaseFactoryContract } from "./utils/database-factory-contract";
import { DatabaseFactoryDefault } from "./defaults/database-factory-default";
import { DatabaseCreatorContract } from "./model/database-creator-contract";

@NgModule({
    providers: [
        DatabaseMigration,
        Database,
        DatabaseHelperService,
        {
            provide: DatabaseFactoryContract,
            useClass: DatabaseFactoryDefault
        }
    ]
})
// https://stackblitz.com/edit/ionic-j3f3ym
export class DatabaseModule {

    public static forRoot(
        settingsProvider: ProviderTyped<DatabaseSettingsFactoryContract>,
        isAvailableProvider: ProviderTyped<boolean>,
        databaseCreatorProvider: ProviderTyped<DatabaseCreatorContract>,
        databaseMigrationContract?: Type<DatabaseMigrationContract>,
        // providers: Provider[] = []
    ): ModuleWithProviders {
        // providers = providers.concat([
        const providers: Provider[] = [
            this.createProvider(DatabaseSettingsFactoryContract, settingsProvider),
            this.createProvider(IS_AVAILABLE_DATABASE, isAvailableProvider),
            this.createProvider(DATABASE_CREATOR, databaseCreatorProvider),
            // {
            //     provide: DatabaseSettingsFactoryContract,
            //     useClass: settingsProvider
            // }
        ];
        // );
        return this.forBase(providers);
    }
    // public static forRoot(
    //     settings: Type<DatabaseSettingsFactoryContract>,
    //     databaseMigrationContract?: Type<DatabaseMigrationContract>,
    //     // providers: Provider[] = []
    // ): ModuleWithProviders {
    //     // providers = providers.concat([
    //     const providers: Provider[] = [
    //         {
    //             provide: DatabaseSettingsFactoryContract,
    //             useClass: settings
    //         }
    //     ];
    //     return this.forBase(providers);
    // }

    // public static forRootValue(
    //     settings: DatabaseSettingsFactoryContract,
    //     databaseMigrationContract?: Type<DatabaseMigrationContract>
    // ): ModuleWithProviders {
    //     const providers: Provider[] = [
    //         {
    //             provide: DatabaseSettingsFactoryContract,
    //             useValue: settings
    //         }
    //     ];
    //     return this.forBase(providers);
    // }

    private static createProvider(provide: any, provider: ProviderTyped<any>): Provider {
        return Object.assign({
            provide: provide
        }, provider);
    }

    private static forBase(
        providers: Provider[],
        databaseMigrationContract?: Type<DatabaseMigrationContract>
    ): ModuleWithProviders {
        if (databaseMigrationContract) {
            providers.push({
                provide: DatabaseMigrationContract,
                useClass: databaseMigrationContract
            });
        }
        return {
            ngModule: DatabaseModule,
            providers: providers
        };
    }
}
