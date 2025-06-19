class MdServer < Formula
  desc "A simple CLI tool that serves markdown files as HTML with beautiful Tailwind CSS styling"
  homepage "https://github.com/pders01/md"
  url "https://github.com/pders01/md.git", branch: "main"
  version "1.0.0"
  license "MIT"

  depends_on "node"

  def install
    # Install pnpm if not available
    unless system("which", "pnpm", out: File::NULL)
      system "npm", "install", "-g", "pnpm"
    end
    
    # Install dependencies and build
    system "pnpm", "install"
    system "pnpm", "run", "build"
    
    # Install the CLI binary
    bin.install "dist/md-server.js" => "md-server"
  end

  test do
    # Test that the CLI can be run
    system "#{bin}/md-server", "--help"
  end
end 