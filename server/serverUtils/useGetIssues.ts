import { Octokit } from "@octokit/core";

export default async (token: string, currentPage: number, name: string, resolve: Function): Promise<void> => {
    const fetchItemsAtOnce = 20;
    const repositoriesPerPage = 4;
    const repositoriesIssues: any = (await useGetCache("Issues")) || { data: [] };
    const octokit = new Octokit({ auth: token });

    if (!repositoriesIssues.data.length) {
        repositoriesIssues.data = await fetchAllRepositoriesIssues(octokit, name, fetchItemsAtOnce);
        useSetCache(repositoriesIssues, "Issues");
    }

    const paginatedIssues = paginate(repositoriesIssues.data, repositoriesPerPage);

    return resolve({
        statusCode: 200,
        statusMessage: "OK",
        message: "The request has succeeded.",
        page: currentPage + 1,
        total: paginatedIssues.length,
        issues: paginatedIssues[currentPage]
    });
}
