## --- REQUIRED PARAMETERS ------------------------------------------------------------------------------------------------

variable "gcp_project_id" {
  type        = string
  default     = "ingka-csr-dccloud-dev"
  description = "Id of the GCP project"
}

variable "region" {
  type        = string
  default     = "europe-west1"
  description = "Region where the GCE VM Instance resides. Defaults to the Google provider's region if nothing is specified here. See https://cloud.google.com/compute/docs/regions-zones"
}
