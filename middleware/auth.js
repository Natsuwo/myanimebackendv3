export default function ({ store, error, redirect }) {
    if (!store.state.auth.isLogin) {
        return redirect('/')
    }
}
