export default S =>
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
                ),
            S.listItem()
                .title("Routes")
                .child(
                    S.documentTypeList("agency")
                        .title("Routes by agency")
                        .child(agency =>
                            S.documentList()
                                .title("Routes")
                                .filter('_type == "route" && $agency == agency._ref')
                                .params({ agency })
                                .defaultOrdering([{ field: 'id', direction: 'asc' }])
                        )
            )
        ]);