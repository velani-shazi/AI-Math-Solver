set -e

echo "========================================"
echo "🚀 Infinity AI Math Solver - Build & Run"
echo "========================================"

ROOT_DIR="$(pwd)"
FRONTEND_DIR="$ROOT_DIR/ai-math-solver-frontend"
BACKEND_DIR="$ROOT_DIR/ai-math-solver-backend"
FRONTEND_BUILD_DIR="$FRONTEND_DIR/build"
BACKEND_BUILD_DIR="$BACKEND_DIR/build"

echo "📦 Building frontend..."

cd "$FRONTEND_DIR"

npm install
npm run build

echo "✅ Frontend build completed."

echo "🧹 Removing old backend build (if exists)..."

if [ -d "$BACKEND_BUILD_DIR" ]; then
  rm -rf "$BACKEND_BUILD_DIR"
  echo "✔ Old backend build removed."
else
  echo "ℹ No backend build found."
fi

echo "📂 Copying frontend build to backend..."

cp -r "$FRONTEND_BUILD_DIR" "$BACKEND_DIR/"

echo "✅ Frontend build copied to backend."

echo "🧹 Cleaning frontend build directory..."

rm -rf "$FRONTEND_BUILD_DIR"

echo "✔ Frontend build directory removed."

echo "🖥️  Installing backend dependencies & starting server..."

cd "$BACKEND_DIR"

node server.js