
export const fetchAllRepositories = async (octokit: any, itemsPerPage: number): Promise<Repository[]> => {
    let repositories: Repository[] = [];
    let page = 1;
    let fetchedRepos;

    while (true) {
        fetchedRepos = await octokit.request('GET /installation/repositories', { per_page: itemsPerPage, page });
        repositories.push(...fetchedRepos.data.repositories);
        if (fetchedRepos.data.repositories.length < itemsPerPage) break;
        page++;
    }

    return repositories;
};

export const sortRepositories = (repositories: Repository[]): Repository[] => {
    return repositories.sort((a, b) => {
        const dateA = a.pushed_at ? new Date(a.pushed_at).getTime() : 0;
        const dateB = b.pushed_at ? new Date(b.pushed_at).getTime() : 0;
        return dateB - dateA;
    });
};

export const paginateRepositories = (repositories: Repository[], repositoriesPerPage: number): Repository[][] => {
    return Array.from({ length: Math.ceil(repositories.length / repositoriesPerPage) }, (_, i) =>
        repositories.slice(i * repositoriesPerPage, (i + 1) * repositoriesPerPage)
    );
};


