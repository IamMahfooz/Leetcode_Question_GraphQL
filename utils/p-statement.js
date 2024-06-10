const querystring =  `#graphql
query selectProblem($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
        content
    }
}`;
module.exports = {
    getSubmissionCode: async  (req,res) => {
        try {
            // const [statement11, setStatement11] = useState("")
            const genericpage = req.query.id;
            fetch(`https://lcid.cc/${genericpage}`).then((response) => {
                const url = response.url
                const parts = url.split('/');
                return parts[parts.length - 1] || parts[parts.length - 2];
            }).then((titleSlug) => {
                // console.log("the title was" ,titleSlug);
                fetch('https://leetcode.com/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Referer: 'https://leetcode.com',
                    },
                    body: JSON.stringify({
                        query: querystring,
                        variables: {
                            titleSlug, //search question using titleSlug
                        },
                    }),
                    mode: 'cors'
                }).then((response) => {
                    // console.log("the response was",response);
                    response.json().then((result) => {
                        // console.log("the result was", result);
                        if (result.errors) {
                            return ""; // Return empty string or handle errors as needed
                        }

                        // console.log(result.data);
                        res.send(result.data);
                    })
                });
                // Return the content
            })
        }catch (error){
            console.log(error)
        }
    },

}

