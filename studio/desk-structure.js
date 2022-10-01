import S from "@sanity/desk-tool/structure-builder";

export default () =>
    S.list()
        .title("Documents")
        .items([
            S.listItem()
                .title("Agencies")
                .child(
                    S.documentTypeList("agency")
                        .title("Agencies")
                ),
            S.listItem()
                .title("Stops")
                .child(
                    S.documentTypeList("agency")
                        .title("Stops by agency")
                        .child(agency =>
                            S.documentList()
                                .title("Stops")
                                .filter('_type == "stop" && $agency == agency._ref')
                                .params({ agency })
                                .defaultOrdering([{ field: 'id', direction: 'asc' }])
                        )
                )
        ]);