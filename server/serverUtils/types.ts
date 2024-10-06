

declare global {
    interface Repository {
        pushed_at: string | null;
        id: number;
    }

    interface Repositories {
        data: {
            repositories: Repository[];
        }
    }

    interface reponseType {
        success: boolean | null;
        error: null | Error;
    }
    
}