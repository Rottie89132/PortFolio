import { Octokit } from "@octokit/core"

export default async (token: any, currentPage: any, resolve: any) => {
    const octokit: any = new Octokit({ auth: token });
    let response: Record<string, any> | boolean | any = await useGetCache("Repositories")

    if (!response) {
        response = await octokit.request('GET /installation/repositories');
        useSetCache(response, "Repositories")
    }

    response.data.repositories.sort((a: any, b: any) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());
    


    const result = [];
    
    for (let i = 0; i < response.data.repositories.length; i += 4) result.push(response.data.repositories.slice(i, i + 4))
    const data = result[currentPage]

    return resolve({
        statusCode: 200,
        statusMessage: "OK",
        message: "The request has succeeded.",
        page: currentPage + 1,
        total: result.length,
        repositories: data
    })
}


