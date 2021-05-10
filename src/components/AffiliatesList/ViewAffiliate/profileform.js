import React, { useState, useEffect } from "react";
import HttpService from "../../../shared/http.service";
import { useForm } from "react-hook-form";
import { useToasts } from "react-toast-notifications";
import UserProfile from "../../../img/dummy-profile-pic.png";
import "react-phone-input-2/lib/style.css";
import filePickerService from "../../../shared/file-picker/file-picker.service";
import ImagePicker from "../../../shared/image-picker/image-picker.component";

const ProfileForm = (props) => {
  const [isEdit, setEdit] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [allInterests, setAllInterests] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [formData, setFormData] = useState({});
  const [profilePicture, setProfilePicture] = useState({});

  const {
    register,
    handleSubmit,
    errors,
    formState,
    reset,
    control,
  } = useForm();

  useEffect(() => {
    get();
  }, []);

  const get = async () => {
    await HttpService.get(`user/profile/${props.userId}`)
      .then(async (res) => {
        reset(res.data.Profile);
        setFormData(res.data.Profile);
        setSelectedInterests(res.data.Profile.Interests);
        setSelectedSkills(res.data.Profile.Skills);

        await HttpService.get("all-interests").then(async (response) => {
          setAllInterests(response.data);
          await HttpService.get("all-skills").then((skillres) => {
            setAllSkills(skillres.data);
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="card custom-card border-top-0">
        <form onSubmit={handleSubmit()}>
          <div className="card-header text-end border-bottom-0"></div>
          {isEdit ? (
            <div className="form-group">
              <ImagePicker
                data={profilePicture}
                afterUpload={(filedata) => {
                  setProfilePicture(filedata);
                }}
                label="Edit Logo"
                icon=""
              />
            </div>
          ) : (
            <div className="profile-img">
              <img
                src={
                  profilePicture && profilePicture.FileHandler
                    ? filePickerService.getProfileLogo(
                        profilePicture.FileHandler
                      )
                    : UserProfile
                }
              />
            </div>
          )}
          <div className="card-body">
            <div className="form-group">
              <label> First Name</label>
              <p className="title">{formData.Name}</p>
            </div>

            <div className="form-group border-bottom">
              <label> Last Name</label>
              <p className="title">{formData.LastName}</p>
            </div>

            <div className="form-group border-bottom">
              <label>Email</label>
              <p className="title">{formData.Email}</p>
            </div>

            <div className="form-group border-bottom">
              <label>Phone Number</label>

              <p>{formData.PhoneNumber}</p>
            </div>

            <div className="form-group border-bottom">
              <label>Company Name</label>

              <p className="title">{formData.CompanyName}</p>
            </div>
            <div className="form-group border-bottom">
              <label>Address</label>
              <p className="title">{formData.Address}</p>
            </div>

            <div className="form-group border-bottom">
              <label>Address Line 2</label>

              <p className="title">{formData.AddressLine2}</p>
            </div>

            <div className="form-group border-bottom">
              <label>City</label>
              <p className="title">{formData.City}</p>
            </div>

            <div className="form-group border-bottom">
              <label>Country</label>

              <p className="title">{formData.Country}</p>
            </div>

            <div className="form-group border-bottom">
              <label>State/Province</label>
              <p className="title">{formData.State}</p>
            </div>

            <div className="checkbox-group mb-2">
              <label className="d-block">Interest</label>
              {selectedInterests &&
                selectedInterests.map((res) => {
                  return (
                    <label className="btn btn-primary">
                      {res.InterestName}
                    </label>
                  );
                })}
            </div>
            <div className="checkbox-group mb-0">
              <label className="d-block">Skills</label>
              {selectedSkills &&
                selectedSkills.map((res) => {
                  return (
                    <label className="btn btn-primary">{res.SkillName}</label>
                  );
                })}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default ProfileForm;
