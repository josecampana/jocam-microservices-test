
#custome vpc
module "custom-vpc" {
  source           = "../modules/custom-vpc"
}

# new service account
module "sa" {
  source           = "../modules/sa"
}

