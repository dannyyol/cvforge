from fastapi import APIRouter

def get_routes_router() -> APIRouter:
    router = APIRouter()
    # Attach CV review routes
    from .review import router as review_router
    router.include_router(review_router, tags=["review"])
    from .pdf import router as pdf_router
    router.include_router(pdf_router, tags=["export"])
    return router
