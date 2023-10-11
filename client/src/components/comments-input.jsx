import React from "react";
import { FormInput } from "@ariakit/react";

export const CommentsInput = () => {
    return (
        <FormInput
            name="comments"
            render={
                <textarea
                    placeholder="Provide additional details about this stop's accessibility that may be useful to other riders."
                    rows="3"
                />
            }
        />
    );
};