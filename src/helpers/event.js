export default {
    '@stop' ($event) {
        $event.preventDefault();
        $event.stopPropagation();
    },

    '@prevent' ($event) {
        $event.preventDefault();
    }
};