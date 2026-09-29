export default async function TestPage(props: PageProps<"/test/[testid]">) {
    const params = await props.params
    return <div>{params.testid}</div>
}
