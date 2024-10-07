import { Octokit } from "@octokit/core";

export default async (token: string, currentPage: number, resolve: Function): Promise<void> => {
    const fetchItemsAtOnce = 20;
    const repositoriesPerPage = 4;
    const repositories: Repositories = (await useGetCache("Repositories")) as Repositories || { data: { repositories: [] } };
    const octokit = new Octokit({ auth: token });

    if (!repositories.data.repositories.length) {
        repositories.data.repositories = await fetchAllRepositories(octokit, fetchItemsAtOnce);
        useSetCache(repositories, "Repositories");
    }

    const sortedRepositories = sortRepositories(repositories.data.repositories);
    const paginatedRepositories = paginate(sortedRepositories, repositoriesPerPage);

    return resolve({
        statusCode: 200,
        statusMessage: "OK",
        message: "The request has succeeded.",
        page: currentPage + 1,
        total: paginatedRepositories.length,
        repositories: paginatedRepositories[currentPage]
    });
}
