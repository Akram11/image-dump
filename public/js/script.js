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
            imageId: location.hash.slice(1),
        },

        mounted: function () {
            var that = this;
            axios
                .get("/get-images")
                .then(function (response) {
                    that.heading = "images";
                    that.images = response.data.rows;
                })
                .then(function () {
                    that.autoScroll();
                })
                .catch(function (err) {
                    console.log("err in GET /get-images", err);
                });

            window.addEventListener("hashchange", function (e) {
                that.imageId = location.hash.slice(1);
            });
            // this.autoScroll();
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
                        // console.log("resp from POST /uplaod: ", resp);
                    })
                    .catch(function (err) {
                        console.log("err in POST /upload: ", err);
                    });
            },
            handleChange: function (e) {
                this.file = e.target.files[0];
            },
            handleImageClick: function (id) {
                // this.showModal = true;
                this.imageId = id;
            },
            close: function () {
                this.imageId = null;
                location.hash = "";
            },
            showMore: function () {
                var that = this;
                const lowestID = this.images[this.images.length - 1].id;
                axios
                    .get("/get-more/" + lowestID)
                    .then(function (response) {
                        let result = response.data.rows;
                        that.images = [...that.images, ...result];
                        that.autoScroll();
                    })
                    .catch((err) => {
                        console.log("err in POST /upload: ", err);
                    });
            },
            autoScroll: function () {
                var that = this;
                setTimeout(function () {
                    if (
                        window.innerHeight + window.pageYOffset >=
                        document.body.clientHeight - 100
                    ) {
                        that.showMore();
                        console.log("autoScroll");
                    } else {
                        this.autoScroll();
                    }
                }, 2000);
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
                    that.photoObj = response.data.rows[0];
                })
                .catch(function (err) {
                    console.log("err in GET /get-image", err);
                });

            axios
                .get("/get-images/" + this.imageId + "/comments")
                .then(function (response) {
                    that.comments = response.data.rows;
                })
                .catch(function (err) {
                    console.log("err in GET /get-image", err);
                });
        },
        watch: {
            imageId: function () {
                console.log("imageId has changed!");
            },
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
                this.comment = "";
                this.username = "";
            },
        },
    });
})();
