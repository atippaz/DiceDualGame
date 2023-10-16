// import type { Context } from '@/interfaces/context'

let context: any
export function getContext() {
    return context
}

export function initializeContext(ctx: any) {
    if (context) throw new Error('Context can only be set once')

    context = ctx
}
