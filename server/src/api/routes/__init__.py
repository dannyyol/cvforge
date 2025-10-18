from fastapi import APIRouter

def get_routes_router() -> APIRouter:
    router = APIRouter()
    # Attach CV review routes
    from .review import router as review_router
    router.include_router(review_router, tags=["review"])
    return router