resource "google_project_service" "project" {
  project = "ingka-csr-dccloud-dev"
  service = "iam.googleapis.com"
  disable_dependent_services = true
}

resource "google_service_account" "service_account" {
  account_id   = "service-account-id"
  display_name = "Service Account"
}