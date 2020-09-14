(function () {
    new Vue({
        el: "main",
        data: {
            heading: "vue is cool :D",
            cuteAnimals: [],
            images: [],
            // reactive
        },
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

        // function() {
        //     var that = this;
        //     axios
        //         .get("/cute-animals")
        //         .then(function (resp) {
        //             that.heading = "animals";
        //             that.cuteAnimals = resp.data.cuteAnimals;
        //         })
        //         .catch(function (err) {
        //             console.log("err in GET /cute-animals", err);
        //         });
        // },
        //lifecyle method
        // runs after the html is loaded
    });
})();
