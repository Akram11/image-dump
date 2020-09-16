(function () {
    new Vue({
        el: "main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        },
        // reactive

        mounted: function () {
            var that = this;
            axios
                .get("/get-images")
                .then(function (response) {
                    console.log(response);
                    that.heading = "images";
                    that.images = response.data.rows;
                })
                .catch(function (err) {
                    console.log("err in GET /cute-animals", err);
                });
        },
        methods: {
            handleClick: function (e) {
                var that = this;
                // prevents the page from reloading
                e.preventDefault();
                // 'this' allows me to see all the properties of data
                // console.log('this! ', this);

                // we NEED to use FormData ONLY when we send a file to the server
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                axios
                    .post("/upload", formData)
                    .then(function (resp) {
                        that.images.unshift(resp.data.rows[0]);
                        console.log("resp from POST /uplaod: ", resp);
                    })
                    .catch(function (err) {
                        console.log("err in POST /upload: ", err);
                    });
            },

            handleChange: function (e) {
                // console.log('handleChange is running!!!!');
                // console.log('file: ', e.target.files[0]);
                this.file = e.target.files[0];
            },
        },
    });
})();
