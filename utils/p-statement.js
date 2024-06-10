const querystring =  `#graphql
query selectProblem($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
        content
    }
}`;
module.exports = {
    getSubmissionCode: async (req, res) => {
        try {
            const genericpage = req.query.id;

            // Fetch the URL and extract the titleSlug
            let response1, url, parts, titleSlug;
            try {
                response1 = await fetch(`https://lcid.cc/${genericpage}`);
                console.log("status code ",response1);
                if (response1.status!==403) {
                    throw new Error(`Error fetching URL: ${response1.statusText}`);
                }
                url = response1.url;
                parts = url.split('/');
                titleSlug = parts[parts.length - 1] || parts[parts.length - 2];
            } catch (error) {
                console.error("Error fetching the initial URL:", error);
                titleSlug = ""; // Set a default value or handle the error as needed
            }

            // Proceed only if titleSlug is obtained
            if (titleSlug) {
                try {
                    // Fetch data from LeetCode GraphQL API
                    const response2 = await fetch('https://leetcode.com/graphql', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Referer: 'https://leetcode.com',
                        },
                        body: JSON.stringify({
                            query: querystring,
                            variables: { titleSlug },
                        }),
                        mode: 'cors'
                    });
                    if (!response2.ok) {
                        throw new Error(`Error fetching from LeetCode GraphQL: ${response2.statusText}`);
                    }
                    const result = await response2.json();

                    if (result.errors) {
                        console.error("Error from GraphQL response:", result.errors);
                        res.status(500).send({ error: "An error occurred while fetching data" });
                    } else {
                        res.send(result.data);
                    }
                } catch (error) {
                    console.error("Error fetching from LeetCode GraphQL:", error);
                    res.status(500).send({ error: "Failed to fetch data from LeetCode" });
                }
            } else {
                res.status(500).send({ error: "Failed to obtain titleSlug" });
            }
        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).send({ error: "An internal server error occurred" });
        }
    },

}

