(function () {
    new Vue({
        el: "main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            showModal: false,
            imageId: null, //location.hash.slice(1),
        },

        mounted: function () {
            var that = this;
            axios
                .get("/get-images")
                .then(function (response) {
                    that.heading = "images";
                    that.images = response.data.rows;
                })
                .catch(function (err) {
                    console.log("err in GET /get-images", err);
                });

            window.addEventListener("hashchange", function (e) {
                // console.log(location.hash);
                that.imageId = location.hash.slice(1);
            });
        },
        methods: {
            handleClick: function (e) {
                var that = this;
                e.preventDefault();
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
                this.file = e.target.files[0];
            },
            handleImageClick: function (id) {
                this.showModal = true;
                this.imageId = id;
            },
        },
    });

    Vue.component("image-modal", {
        props: ["imageId"],
        template: "#image-modal",
        data: function () {
            return {
                photoObj: {},
                comments: [],
                username: "",
                comment: "",
            };
        },
        mounted: function () {
            var that = this;
            axios
                .get("/get-images/" + this.imageId)
                .then(function (response) {
                    console.log(response);
                    that.photoObj = response.data.rows[0];
                })
                .catch(function (err) {
                    console.log("err in GET /get-image", err);
                });

            axios
                .get("/get-images/" + this.imageId + "/comments")
                .then(function (response) {
                    that.comments = response.data.rows;
                    console.log("comments", that.comments);
                })
                .catch(function (err) {
                    console.log("err in GET /get-image", err);
                });
        },
        watch: {
            imageId: function () {},
        },
        methods: {
            handleComment: function (e) {
                var that = this;
                e.preventDefault();
                console.log(this.username, this.comment, this.imageId);
                axios
                    .post("/comment", {
                        username: this.username,
                        comment: this.comment,
                        imageId: that.imageId,
                    })
                    .then((resp) => {
                        that.comments.unshift(resp.data.rows[0]);
                    })
                    .catch((err) => {
                        console.error("error in handleComment", err);
                    });
            },
        },
    });
})();
