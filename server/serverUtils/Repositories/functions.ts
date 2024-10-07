export const fetchAllRepositoriesIssues = async (octokit: any, name: string, itemsPerPage: number) => {
    let issues: any[] = [];
    let page = 1;
    let fetchedIssues;

    while (true) {
        fetchedIssues = await octokit.request(`GET /repos/Rottie89132/${name}/issues`, {
            owner: 'Rottie89132',
            repo: 'PortFolio',
        });

        for (const issue of fetchedIssues.data) {
            const fetchedLabels = await octokit.request(`GET /repos/${issue.user.login}/${name}/issues/${issue.number}/labels`, {
                owner: 'Rottie89132',
                repo: 'PortFolio',
                issue_number: issue.number
            });

            fetchedIssues.data.labels = fetchedLabels.data;
        }

        issues.push(...fetchedIssues.data);
        if (fetchedIssues.data.length < itemsPerPage) break;
        page++;
    }

    return issues;
};



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

export const paginate = (repositories: Repository[], repositoriesPerPage: number): Repository[][] => {
    return Array.from({ length: Math.ceil(repositories.length / repositoriesPerPage) }, (_, i) =>
        repositories.slice(i * repositoriesPerPage, (i + 1) * repositoriesPerPage)
    );
};




